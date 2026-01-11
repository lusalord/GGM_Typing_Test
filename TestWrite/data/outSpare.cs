class Program
{
    static void Main(string[] args)
    {
        int[] arr = Array.ConvertAll(Console.ReadLine().Split(), int.Parse);

        int min1 = Math.Min(arr[0], arr[2] - arr[0]);
        int min2 = Math.Min(arr[1], arr[3] - arr[1]);

        Console.WriteLine(Math.Max(min1, min2));
    }
}